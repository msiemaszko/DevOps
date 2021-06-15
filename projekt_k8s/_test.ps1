echo "`nTest backend /api:"
curl http://127.0.0.1:31000/computer | Select-Object -Expand Content

echo "`nTest frontend:"
curl http://127.0.0.1:31003 | Select-Object -Expand Content