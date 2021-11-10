define({ "api": [
  {
    "type": "get",
    "url": "/version",
    "title": "[Get] /version",
    "name": "GetApiVersion",
    "group": "General",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "apiVersion",
            "description": "<p>api server version</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"apiVersion\": \"0.1.0\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/pages/api/version.ts",
    "groupTitle": "General"
  },
  {
    "type": "get",
    "url": "/",
    "title": "[GET] /",
    "name": "GetStatus",
    "group": "General",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status of api server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/pages/api/index.ts",
    "groupTitle": "General"
  }
] });
