# Code Style Guidelines

## .NET
- C# 12 / .NET 8
- Nullable enabled
- Use records for DTOs where appropriate
- Use FluentValidation for command validation
- Use MediatR (optional) OR simple services — choose one and stay consistent
- Controllers should:
  - authorize
  - map request -> command/query
  - call application
  - return DTO or ProblemDetails

## React Native
- TypeScript strict
- Feature folders under src/features
- TanStack Query for server state
- Keep UI components dumb; business logic in hooks/services
