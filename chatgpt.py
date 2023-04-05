import sys
import os
import openai

openai.api_key = "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"
openai.organization = "org-y0Vo7LQzqKJrfECSK5CMgXmQ"

response = openai.ChatCompletion.create(
model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": sys.argv[1]}
    ]
)
print(response)   
