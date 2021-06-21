echo "`nTest backend /api:"
curl http://127.0.0.1/api/computer | Select-Object -Expand Content

echo "`nTest frontend:"
curl http://127.0.0.1 | Select-Object -Expand Content