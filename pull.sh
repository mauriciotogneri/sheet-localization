#!/usr/bin/env bash

set -e

LOCALE="en"
FORMAT="json"
TOKEN="???"
URL="???"

wget -O "${LOCALE}.json" "${URL}?locale=${LOCALE}&format=${FORMAT}&token=${TOKEN}"