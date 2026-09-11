"""
Local preview server.

Python's built-in `python -m http.server` ignores HTTP Range requests, which
means video scrubbing is dead: you can't drag the progress bar, and clicking a
timestamp does nothing. GitHub Pages serves byte ranges properly, so the
deployed site is fine. This just makes the local preview behave the same way.

    python preview.py            -> http://127.0.0.1:8899
    python preview.py 9000       -> a different port

Ctrl+C to stop.
"""

import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE_RE = re.compile(r"^bytes=(\d*)-(\d*)$")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler that understands single-part byte ranges.

    Deliberately left on HTTP/1.0 (the default). Keep-alive adds framing rules
    that are easy to get subtly wrong, and a desynced connection shows up as a
    video that spins forever instead of an obvious error. One connection per
    request is slower and completely reliable, which is the right trade for a
    preview server.
    """

    def send_head(self):
        header = self.headers.get("Range")
        path = self.translate_path(self.path)

        if header is None or os.path.isdir(path):
            return super().send_head()

        match = RANGE_RE.match(header.strip())
        if not match:
            return super().send_head()  # Unparseable range: just send it all.

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        first, last = match.group(1), match.group(2)

        if first == "":
            if last == "":
                f.close()
                self.send_error(400, "Malformed Range header")
                return None
            length = min(int(last), size)          # "bytes=-500" -> final 500
            start, end = size - length, size - 1
        else:
            start = int(first)
            end = min(int(last), size - 1) if last else size - 1

        if start > end or start >= size:
            f.close()
            self.send_response(416, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        self.send_response(206, "Partial Content")
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()

        f.seek(start)
        return _Slice(f, end - start + 1)

    def copyfile(self, source, outputfile):
        # The browser routinely aborts a media request mid-stream to ask for a
        # different range. That is normal, not an error worth a stack trace.
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def log_message(self, fmt, *args):
        if args and "favicon" in str(args[0]):
            return
        super().log_message(fmt, *args)


class _Slice:
    """A read-only window onto an open file, so copyfile stops at the range end."""

    def __init__(self, fileobj, remaining):
        self._f = fileobj
        self._remaining = remaining

    def read(self, amount=-1):
        if self._remaining <= 0:
            return b""
        if amount is None or amount < 0:
            amount = self._remaining
        chunk = self._f.read(min(amount, self._remaining))
        self._remaining -= len(chunk)
        return chunk

    def close(self):
        self._f.close()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(("127.0.0.1", port), RangeRequestHandler)
    print(f"Preview running at http://127.0.0.1:{port}  (Ctrl+C to stop)")
    print("Scrubbing and timestamp jumps work here, same as they will once live.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    main()
