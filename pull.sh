#!/usr/bin/env bash

set -e

LOCALE="en"
FORMAT="json"
TOKEN="???"
URL="???"

curl -o "${LOCALE}.json" -L "${URL}?locale=${LOCALE}&format=${FORMAT}&token=${TOKEN}"