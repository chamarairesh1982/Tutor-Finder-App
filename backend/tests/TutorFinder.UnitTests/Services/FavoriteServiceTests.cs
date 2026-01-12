using FluentAssertions;
using Moq;
using TutorFinder.Application.Interfaces;
using TutorFinder.Application.Services;
using TutorFinder.Domain.Entities;
using TutorFinder.Domain.Enums;

namespace TutorFinder.UnitTests.Services;

public class FavoriteServiceTests
{
    private readonly Mock<IFavoriteRepository> _favoriteRepositoryMock;
    private readonly Mock<ITutorRepository> _tutorRepositoryMock;
    private readonly FavoriteService _sut;

    public FavoriteServiceTests()
    {
        _favoriteRepositoryMock = new Mock<IFavoriteRepository>();
        _tutorRepositoryMock = new Mock<ITutorRepository>();
        _sut = new FavoriteService(_favoriteRepositoryMock.Object, _tutorRepositoryMock.Object);
    }

    [Fact]
    public async Task AddFavoriteAsync_ShouldReturnSuccess_WhenValid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tutorProfileId = Guid.NewGuid();
        var tutor = new TutorProfile 
        { 
            Id = tutorProfileId, 
            UserId = Guid.NewGuid(), // Different user
            FullName = "Tutor Name",
            Subjects = new List<TutorSubject>()
        };

        _tutorRepositoryMock.Setup(x => x.GetByIdAsync(tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(tutor);
        
        _favoriteRepositoryMock.Setup(x => x.ExistsAsync(userId, tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.AddFavoriteAsync(userId, tutorProfileId, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.TutorProfileId.Should().Be(tutorProfileId);
        _favoriteRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Favorite>(), It.IsAny<CancellationToken>()), Times.Once);
        _favoriteRepositoryMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task AddFavoriteAsync_ShouldReturnFailure_WhenTutorNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tutorProfileId = Guid.NewGuid();

        _tutorRepositoryMock.Setup(x => x.GetByIdAsync(tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TutorProfile)null!);

        // Act
        var result = await _sut.AddFavoriteAsync(userId, tutorProfileId, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.FailureInfo!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task AddFavoriteAsync_ShouldReturnFailure_WhenAlreadyFavorited()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tutorProfileId = Guid.NewGuid();
        var tutor = new TutorProfile { Id = tutorProfileId, UserId = Guid.NewGuid() };

        _tutorRepositoryMock.Setup(x => x.GetByIdAsync(tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(tutor);
        
        _favoriteRepositoryMock.Setup(x => x.ExistsAsync(userId, tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.AddFavoriteAsync(userId, tutorProfileId, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.FailureInfo!.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task AddFavoriteAsync_ShouldReturnFailure_WhenFavoritingOwnProfile()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tutorProfileId = Guid.NewGuid();
        var tutor = new TutorProfile { Id = tutorProfileId, UserId = userId }; // Same user

        _tutorRepositoryMock.Setup(x => x.GetByIdAsync(tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(tutor);

        // Act
        var result = await _sut.AddFavoriteAsync(userId, tutorProfileId, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.FailureInfo!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task RemoveFavoriteAsync_ShouldReturnSuccess_WhenExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tutorProfileId = Guid.NewGuid();
        var favorite = new Favorite { UserId = userId, TutorProfileId = tutorProfileId };

        _favoriteRepositoryMock.Setup(x => x.GetByUserAndTutorAsync(userId, tutorProfileId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(favorite);

        // Act
        var result = await _sut.RemoveFavoriteAsync(userId, tutorProfileId, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _favoriteRepositoryMock.Verify(x => x.Remove(favorite), Times.Once);
        _favoriteRepositoryMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
