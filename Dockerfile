FROM public.ecr.aws/docker/library/node:20 AS asset-builder
WORKDIR /usr/src/app
COPY . .
RUN npm ci &&  \
    npm run process-template &&  \
    npm run build && \
    npm run update-css &&  \
    npm run update-timestamp

FROM nginx:stable-alpine as builder
RUN set -ex && \
    apk update && \
    apk add linux-headers openssl-dev pcre-dev zlib-dev openssl abuild \
               musl-dev libxslt libxml2-utils make mercurial gcc unzip git \
               xz g++ && \
    # allow abuild as a root user \
    printf "#!/bin/sh\\n/usr/bin/abuild -F \"\$@\"\\n" > /usr/local/bin/abuild && \
    chmod +x /usr/local/bin/abuild && \
    hg clone -r ${NGINX_VERSION}-${PKG_RELEASE} https://hg.nginx.org/pkg-oss/ && \
    cd pkg-oss && \
    mkdir /tmp/packages && \
    echo "Building brotli for nginx-$NGINX_VERSION"; \
       if make -C /pkg-oss/alpine list | grep -E "^brotli\s+\d+" > /dev/null; then \
           echo "Building brotli from pkg-oss sources"; \
           cd /pkg-oss/alpine; \
           make abuild-module-brotli BASE_VERSION=$NGINX_VERSION NGINX_VERSION=$NGINX_VERSION; \
           apk add $(. ./abuild-module-brotli/APKBUILD; echo $makedepends;); \
           make module-brotli BASE_VERSION=$NGINX_VERSION NGINX_VERSION=$NGINX_VERSION; \
           find ~/packages -type f -name "*.apk" -exec mv -v {} /tmp/packages/ \;; \
       else \
           echo "Don't know how to build brotli module, exiting"; \
           exit 1; \
       fi

FROM nginx:stable-alpine
COPY --from=builder /tmp/packages /tmp/packages
COPY --from=asset-builder /usr/src/app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/default.conf /etc/nginx/conf.d/default.conf

RUN set -ex && \
    apk add --no-cache --allow-untrusted /tmp/packages/nginx-module-brotli-${NGINX_VERSION}*.apk && \
    rm -rf /tmp/packages && \
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    chgrp -R root /var/cache/nginx && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf && \
    addgroup nginx root && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    chown nginx:nginx /usr/share/nginx/html

EXPOSE 8081

USER nginx

CMD ["nginx", "-g", "daemon off;"]
