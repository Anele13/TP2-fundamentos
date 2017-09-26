FROM python:3.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./

RUN pip install -r requirements.txt
RUN git clone https://github.com/Anele13/TP2-fundamentos.git

EXPOSE 5000

CMD ["python", "TP2-fundamentos/app.py"]
