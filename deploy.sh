#!/bin/bash
echo "Installing requirements..."
python -m pip install -r requirements.txt
echo "Checking mkdocs location..."
python -m pip show mkdocs
echo "Checking scripts path..."
python -c "import sysconfig; print(sysconfig.get_path('scripts'))"
echo "Attempting deploy..."
python -m mkdocs gh-deploy --verbose
