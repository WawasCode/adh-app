#!/bin/bash

# Start the Photon server in the background
java -Xmx4G -jar photon.jar -data-dir ./photon_data &

# Function to check if the server is ready
wait_for_server() {
  until curl -s http://localhost:9201; do
    echo "Waiting for the server to be ready..."
    sleep 2
  done
}

# Wait for the server to be ready
wait_for_server

# Create the photon index with necessary settings
echo "Creating the photon index..."
response=$(curl -s -X PUT "localhost:9201/photon" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0,
      "analysis": {
        "filter": {
          "german_stop": {
            "type": "stop",
            "stopwords": "_german_"
          },
          "german_keywords": {
            "type": "keyword_marker",
            "keywords": ["Example"]
          },
          "german_stemmer": {
            "type": "stemmer",
            "language": "light_german"
          }
        },
        "analyzer": {
          "german": {
            "tokenizer": "standard",
            "filter": [
              "lowercase",
              "german_stop",
              "german_keywords",
              "german_stemmer"
            ]
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": { "type": "text", "analyzer": "german" },
      "country": { "type": "keyword" },
      "city": { "type": "keyword" },
      "postcode": { "type": "keyword" },
      "street": { "type": "text" },
      "housenumber": { "type": "keyword" },
      "location": { "type": "geo_point" }
    }
  }
}')

# Check if the index creation was successful
if [ -z "$(echo $response | grep '\"acknowledged\":true')" ]; then
  echo "Failed to create the photon index."
  echo "Response: $response"
  exit 1
fi

echo "Photon index created successfully."

# Import the JSON data
echo "Importing data..."
java -Xmx4G -jar photon.jar -data-dir ./photon_data -import-file ./berlin.json

# Keep the container running
wait
