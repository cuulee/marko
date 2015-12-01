{
  "type": "TemplateRoot",
  "body": [
    {
      "type": "FunctionDeclaration",
      "name": "create",
      "params": [
        "__helpers"
      ],
      "body": [
        {
          "type": "Vars",
          "kind": "var",
          "declarations": [
            {
              "id": "str",
              "init": "__helpers.s"
            },
            {
              "id": "empty",
              "init": "__helpers.e"
            },
            {
              "id": "notEmpty",
              "init": "__helpers.ne"
            }
          ]
        },
        {
          "type": "Return",
          "argument": {
            "type": "FunctionDeclaration",
            "name": "render",
            "params": [
              "data",
              "out"
            ],
            "body": [
              {
                "type": "TextOutput",
                "argument": {
                  "type": "Literal",
                  "value": "Hello"
                }
              },
              {
                "type": "HtmlOutput",
                "argument": "data.name"
              },
              {
                "type": "TextOutput",
                "argument": {
                  "type": "Literal",
                  "value": "!"
                }
              },
              {
                "type": "If",
                "test": {
                  "type": "FunctionCall",
                  "callee": "notEmpty",
                  "args": [
                    "data.colors"
                  ]
                },
                "body": [
                  {
                    "type": "HtmlElement",
                    "tagName": "ul",
                    "attributes": [
                      {
                        "name": "class",
                        "value": {
                          "type": "Literal",
                          "value": "colors"
                        }
                      }
                    ],
                    "body": [
                      {
                        "type": "FunctionCall",
                        "callee": "forEach",
                        "args": [
                          "data.colors",
                          {
                            "type": "FunctionDeclaration",
                            "name": null,
                            "params": [
                              "color"
                            ],
                            "body": [
                              {
                                "type": "HtmlElement",
                                "tagName": "li",
                                "attributes": [
                                  {
                                    "name": "class",
                                    "value": {
                                      "type": "Literal",
                                      "value": "color"
                                    }
                                  }
                                ],
                                "body": [
                                  {
                                    "type": "TextOutput",
                                    "argument": "color"
                                  }
                                ],
                                "allowSelfClosing": false,
                                "startTagOnly": false
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    "allowSelfClosing": false,
                    "startTagOnly": false
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "staticVars": {
    "str": "__helpers.s",
    "empty": "__helpers.e",
    "notEmpty": "__helpers.ne",
    "escapeXml": "__helpers.x"
  }
}