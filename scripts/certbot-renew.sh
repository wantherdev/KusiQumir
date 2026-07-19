#!/bin/sh
# Certbot renewal script — runs daily via cron
/usr/bin/certbot renew --quiet --no-self-upgrade
