//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var mocks;
    (function (mocks) {
        var MockInterpretResponse = (function () {
            function MockInterpretResponse() {
            }
            MockInterpretResponse.generateFromJson = function (utterance, jsonObject) {
                return new InJs.InterpretResponse('mock-response', utterance, jsonObject);
            };
            MockInterpretResponse.Empty = function () {
                return MockInterpretResponse.generateFromJson('blah ', MockInterpretResults.Empty);
            };
            MockInterpretResponse.WithAutoCompletion = function () {
                return MockInterpretResponse.generateFromJson('blah ', MockInterpretResults.WithAutoCompletion);
            };
            MockInterpretResponse.WithAutoCompletionContainingInsertions = function () {
                return MockInterpretResponse.generateFromJson('list customer', MockInterpretResults.WithAutoCompletionContainingInsertions);
            };
            MockInterpretResponse.WithVisual = function () {
                return MockInterpretResponse.generateFromJson('utterance', MockInterpretResults.WithVisual);
            };
            return MockInterpretResponse;
        })();
        mocks.MockInterpretResponse = MockInterpretResponse;
        var MockInterpretResults = (function () {
            function MockInterpretResults() {
            }
            MockInterpretResults.Empty = [
                {
                    "Restatement": null,
                    "CompletedUtterance": {
                        "Text": "blah ",
                        "Terms": [
                            {
                                "StartCharIndex": 0
                            },
                            {
                                "StartCharIndex": 4
                            }
                        ]
                    },
                    "AlternateCompletions": [],
                    "VirtualServerName": "d1e4fb46cb0c4d98608740e8e4118e72",
                    "DatabaseName": "wb_2f7ed5b1-1e14-4b91-bf3b-6093aabc3651"
                },
                {
                    "Restatement": null,
                    "CompletedUtterance": {
                        "Text": "blah ",
                        "Terms": [
                            {
                                "StartCharIndex": 0
                            },
                            {
                                "StartCharIndex": 4
                            }
                        ]
                    },
                    "AlternateCompletions": [],
                    "VirtualServerName": "d1e4fb46cb0c4d98608740e8e4118e72",
                    "DatabaseName": "wb_92d060ce-2501-4883-bb3a-1972d0fd6e94"
                },
                {
                    "Restatement": null,
                    "CompletedUtterance": {
                        "Text": "blah ",
                        "Terms": [
                            {
                                "StartCharIndex": 0
                            },
                            {
                                "StartCharIndex": 4
                            }
                        ]
                    },
                    "AlternateCompletions": [],
                    "VirtualServerName": "d1e4fb46cb0c4d98608740e8e4118e72",
                    "DatabaseName": "wb_64d8f829-7818-4432-9bba-05cd2bc13117"
                }
            ];
            //#endregion
            MockInterpretResults.WithAutoCompletion = [
                {
                    "Restatement": "Show grants",
                    "CompletedUtterance": {
                        "Text": "grants for this year",
                        "Terms": [
                            {
                                "StartCharIndex": 0
                            },
                            {
                                "StartCharIndex": 6
                            },
                            {
                                "StartCharIndex": 7
                            },
                            {
                                "StartCharIndex": 10
                            },
                            {
                                "StartCharIndex": 11
                            },
                            {
                                "StartCharIndex": 15
                            },
                            {
                                "StartCharIndex": 16
                            }
                        ]
                    },
                    "Command": {
                        "Query": {
                            "DatabaseName": "wb_92d060ce-2501-4883-bb3a-1972d0fd6e94",
                            "From": [
                                {
                                    "Name": "g",
                                    "Entity": "Grants"
                                }
                            ],
                            "Where": [],
                            "OrderBy": [],
                            "Select": [
                                {
                                    "SourceRef": {
                                        "Source": "g"
                                    }
                                }
                            ]
                        },
                        "SuggestedVisualizations": []
                    },
                    "AlternateCompletions": [
                        {
                            "Items": [
                                {
                                    "TermIndices": [
                                        0
                                    ],
                                    "Text": null
                                },
                                {
                                    "TermIndices": [
                                        1
                                    ],
                                    "Text": " amount"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [
                                        0
                                    ],
                                    "Text": null
                                },
                                {
                                    "TermIndices": [
                                        1
                                    ],
                                    "Text": " end date"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [
                                        0
                                    ],
                                    "Text": null
                                },
                                {
                                    "TermIndices": [
                                        1
                                    ],
                                    "Text": " start date"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [
                                        0
                                    ],
                                    "Text": null
                                },
                                {
                                    "TermIndices": [
                                        1
                                    ],
                                    "Text": " term in month"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [
                                        0
                                    ],
                                    "Text": null
                                },
                                {
                                    "TermIndices": [
                                        1
                                    ],
                                    "Text": " term in months raw"
                                }
                            ]
                        }
                    ],
                    "SuggestionItems": [],
                    "UnrecognizedTerms": [],
                    "VirtualServerName": "d1e4fb46cb0c4d98608740e8e4118e72",
                    "DatabaseName": "wb_92d060ce-2501-4883-bb3a-1972d0fd6e94"
                }
            ];
            //#endregion
            MockInterpretResults.WithAutoCompletionContainingInsertions = [
                {
                    "Restatement": "Show customers",
                    "CompletedUtterance": {
                        "Text": "list customer",
                        "Terms": [
                            {
                                "StartCharIndex": 0
                            },
                            {
                                "StartCharIndex": 4
                            },
                            {
                                "StartCharIndex": 5
                            }
                        ]
                    },
                    "Command": {
                        "Query": {
                            "DatabaseName": "nnorthwind",
                            "From": [
                                {
                                    "Name": "c",
                                    "Entity": "Customers"
                                }
                            ],
                            "Where": [],
                            "OrderBy": [],
                            "Select": [
                                {
                                    "SourceRef": {
                                        "Source": "c"
                                    }
                                }
                            ]
                        },
                        "SuggestedVisualizations": []
                    },
                    "AlternateCompletions": [
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in UK"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in USA"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in London"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Madrid"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in France"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Brazil"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Germany"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Sao Paulo"
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Mexico D.F."
                                }
                            ]
                        },
                        {
                            "Items": [
                                {
                                    "TermIndices": [0, 1, 2]
                                },
                                {
                                    "TermIndices": null,
                                    "Text": " lives in Buenos Aires"
                                }
                            ]
                        }
                    ],
                    "VirtualServerName": "n15g3nmqwe",
                    "DatabaseName": "nnorthwind"
                }
            ];
            //#endregion
            MockInterpretResults.WithVisual = [
                {
                    "Restatement": "Show gdp",
                    "CompletedUtterance": {
                        "Text": "gdp",
                        "Terms": [{ "StartCharIndex": 0 }]
                    },
                    "Command": {
                        "Query": {
                            "DatabaseName": "worldbankindicatorssamplemodel_45b7d322-5a5b-40f0-a2dc-087655b131d2",
                            "From": [{ "Name": "c", "Entity": "CountryRegionData" }],
                            "Where": [],
                            "OrderBy": [],
                            "Select": [
                                {
                                    "Name": "gdp__current_US__",
                                    "Column": {
                                        "Expression": {
                                            "SourceRef": { "Source": "c" }
                                        },
                                        "Property": "gdp__current_US__"
                                    }
                                }
                            ]
                        },
                        "SuggestedVisualizations": [],
                        "Data": "{\"DataShapes\":[{\"Id\":\"DS0\",\"PrimaryHierarchy\":[{\"Id\":\"DM0\",\"Instances\":[{\"Calculations\":[{\"Id\":\"M0\",\"Value\":\"71918394482447.687D\"}]}]}],\"IsComplete\":true}]}",
                        "Binding": "{\"Select\":[{\"Kind\":2,\"Value\":\"M0\",\"Format\":\"#,0.00\"}]}",
                        "VisualConfigurations": [
                            {
                                "VisualizationType": 3 /* Card */,
                                "DataShapeBinding": { "Primary": { "Groupings": [{ "Projections": [0] }] } }
                            },
                            {
                                "VisualizationType": 0 /* Table */,
                                "DataShapeBinding": { "Primary": { "Groupings": [{ "Projections": [0] }] } }
                            }
                        ]
                    },
                    "AlternateCompletions": [
                        {
                            "Items": [{ "TermIndices": [0], "Text": "gdp growth" }]
                        }
                    ],
                    "SuggestionItems": [
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "population"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "urban population"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "rural population"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "gdp growth"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "gdp per capita"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "primary school enrollment"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "secondary school enrollment"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "mobile users"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "internet users"
                        },
                        {
                            "TermStartIndex": 0,
                            "TermEndIndex": 0,
                            "SuggestedReplacement": "agricultural land"
                        }
                    ],
                    "Score": 0.9987401688,
                    "VirtualServerName": "shared",
                    "DatabaseName": "worldbankindicatorssamplemodel_45b7d322-5a5b-40f0-a2dc-087655b131d2",
                    "QueryMetadata": {
                        "Select": [{ "Restatement": "Gdp", "Type": powerbi.data.SemanticType.Integer }]
                    }
                }
            ];
            return MockInterpretResults;
        })();
        mocks.MockInterpretResults = MockInterpretResults;
    })(mocks = powerbitests.mocks || (powerbitests.mocks = {}));
})(powerbitests || (powerbitests = {}));
