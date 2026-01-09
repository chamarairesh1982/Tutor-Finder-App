namespace TutorFinder.Application.Common;

public abstract record Result<T>
{
    public record Success(T Value) : Result<T>;
    public record Failure(string Message, int StatusCode = 400) : Result<T>;

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<Failure, TResult> onFailure) =>
        this switch
        {
            Success s => onSuccess(s.Value),
            Failure f => onFailure(f),
            _ => throw new InvalidOperationException()
        };
}
