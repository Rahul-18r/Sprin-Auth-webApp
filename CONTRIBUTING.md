# Contributing

Thanks for your interest in contributing to this project. We welcome bug reports, improvements, documentation fixes, and new features.

How to contribute:

1. Fork the repository and create a new branch for your work: `git checkout -b feature/my-change`.
2. Implement your change and add tests where appropriate.
3. Run the build and tests locally for the relevant part:

```bash
# backend
cd auth-backend
./mvnw test

# frontend
cd auth-front
npm install
npm run build
```

4. Commit with a clear message and open a pull request with a short description of the change.

Coding style:
- Java: follow existing code style and formatting used in the repo.
- TypeScript/React: follow the existing ESLint rules.

Thanks — maintainers will review your PR and provide feedback.
