package logger

import "net/http"

// ResponseWriter wraps http.ResponseWriter to capture the status code that
// was actually written, since http.ResponseWriter itself doesn't expose it.
type ResponseWriter struct {
	http.ResponseWriter
	statusCode    int
	headerWritten bool
}

func NewResponseWriter(w http.ResponseWriter) *ResponseWriter {
	return &ResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
}

func (rw *ResponseWriter) WriteHeader(statusCode int) {
	rw.ResponseWriter.WriteHeader(statusCode)
	if !rw.headerWritten {
		rw.statusCode = statusCode
		rw.headerWritten = true
	}
}

func (rw *ResponseWriter) Write(b []byte) (int, error) {
	if !rw.headerWritten {
		rw.statusCode = http.StatusOK
		rw.headerWritten = true
	}
	return rw.ResponseWriter.Write(b)
}

func (rw *ResponseWriter) StatusCode() int {
	return rw.statusCode
}
