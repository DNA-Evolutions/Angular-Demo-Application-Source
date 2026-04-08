# Regenerate API Knowledge File

After regenerating the OpenAPI models (e.g. via `npm run generate:api`), run the following command from the project root to create a single knowledge dump of all generated TypeScript files:

```bash
find build/openapi -type f \( -name "*.ts" -o -name "*.json" -o -name "*.md" -o -name "*.txt" -o -name "*.yml" -o -name "*.yaml" \) | sort | while read f; do echo ""; echo "========================================"; echo "FILE: $f"; echo "========================================"; cat "$f"; done > angular_model_knowledge.txt
```

This produces `angular_model_knowledge.txt` which can be used as an AI knowledge base containing all OpenAPI-generated models, services, and configuration.
