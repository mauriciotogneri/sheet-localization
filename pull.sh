#!/usr/bin/env bash

LOCALE="en"
FORMAT="json"
TOKEN="990a86c9-bca3-4821-b1af-bbc5de73f3e3"
URL="https://script.google.com/macros/s/AKfycbwqIvdUhGJOW6St32FXykq1DYPjFvzZGTxyVS80q9J-rKLl9w8M/exec"

wget -O "${LOCALE}.${FORMAT}" "${URL}?locale=${LOCALE}&format=${FORMAT}&token=${TOKEN}"