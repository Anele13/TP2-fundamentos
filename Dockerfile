FROM python:3.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 5000

RUN git clone https://github.com/Anele13/TP2-fundamentos.git



CMD ["python", "TP1-fundamentos/TP1-fundamentos/app.py"]
