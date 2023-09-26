FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install \
  -y --no-install-recommends \
  git gcc libpq-dev python3-dev curl \
  && python -m pip install --upgrade pip \
  && pip install pipenv

RUN mkdir /desupervised
WORKDIR /desupervised

COPY ./server /desupervised

RUN cd /desupervised && pipenv install --system --deploy --ignore-pipfile
