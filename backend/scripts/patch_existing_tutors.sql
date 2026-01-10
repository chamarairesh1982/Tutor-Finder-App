-- Patch existing tutors with real coordinates, availability, and ratings
-- SQL Server version using geography::Point and NEWID().
-- Back up before running. Run in the TutorFinder database context.

BEGIN TRAN;

-- Clear old availability for the targeted tutors
DELETE FROM [AvailabilitySlots]
WHERE [TutorProfileId] IN (
    'B8DDA30C-E0D0-4B8C-9384-B8D79B4B1459',
    '2143C039-5A01-4B33-A659-BD0F5E762797',
    '5BF09A8B-E0D7-4AA9-80EA-F0F5034397AA',
    '2FEB9CEA-458C-4192-B71C-5E5DCC060080',
    'B158A1BE-FBF3-43C8-A5AF-183C1AF8F5A3',
    'FC54AAC4-A40B-45B1-B4D1-A249C9AE1187'
);

-- James Smith (Music, London)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 51.5073,
    [BaseLongitude] = -0.1283,
    [Location] = geography::Point(51.5073, -0.1283, 4326),
    [TravelRadiusMiles] = 5,
    [HasDbs] = 1,
    [AverageRating] = 5.0,
    [ReviewCount] = 1,
    [IsActive] = 1
WHERE [Id] = 'B8DDA30C-E0D0-4B8C-9384-B8D79B4B1459';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), 'B8DDA30C-E0D0-4B8C-9384-B8D79B4B1459', 6, '10:00', '12:00'),
    (NEWID(), 'B8DDA30C-E0D0-4B8C-9384-B8D79B4B1459', 3, '18:00', '20:00');

-- Sarah Jenkins (Programming, London)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 51.5226,
    [BaseLongitude] = -0.0764,
    [Location] = geography::Point(51.5226, -0.0764, 4326),
    [TravelRadiusMiles] = 10,
    [HasCertification] = 1,
    [AverageRating] = 4.6,
    [ReviewCount] = 3,
    [IsActive] = 1
WHERE [Id] = '2143C039-5A01-4B33-A659-BD0F5E762797';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), '2143C039-5A01-4B33-A659-BD0F5E762797', 2, '18:00', '20:00'),
    (NEWID(), '2143C039-5A01-4B33-A659-BD0F5E762797', 4, '18:00', '20:00');

-- Emma Thompson (English, London)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 51.5332,
    [BaseLongitude] = -0.1130,
    [Location] = geography::Point(51.5332, -0.1130, 4326),
    [TravelRadiusMiles] = 8,
    [HasDbs] = 1,
    [AverageRating] = 4.5,
    [ReviewCount] = 2,
    [IsActive] = 1
WHERE [Id] = '5BF09A8B-E0D7-4AA9-80EA-F0F5034397AA';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), '5BF09A8B-E0D7-4AA9-80EA-F0F5034397AA', 6, '09:00', '12:00'),
    (NEWID(), '5BF09A8B-E0D7-4AA9-80EA-F0F5034397AA', 1, '17:00', '19:00');

-- Dr. Robert Miller (Maths, Manchester)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 53.4808,
    [BaseLongitude] = -2.2426,
    [Location] = geography::Point(53.4808, -2.2426, 4326),
    [TravelRadiusMiles] = 15,
    [AverageRating] = 4.7,
    [ReviewCount] = 5,
    [IsActive] = 1
WHERE [Id] = '2FEB9CEA-458C-4192-B71C-5E5DCC060080';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), '2FEB9CEA-458C-4192-B71C-5E5DCC060080', 6, '10:00', '13:00'),
    (NEWID(), '2FEB9CEA-458C-4192-B71C-5E5DCC060080', 2, '17:00', '19:00');

-- Dr. Linda Watson (Science, Manchester)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 53.4475,
    [BaseLongitude] = -2.2227,
    [Location] = geography::Point(53.4475, -2.2227, 4326),
    [TravelRadiusMiles] = 5,
    [HasCertification] = 1,
    [AverageRating] = 4.7,
    [ReviewCount] = 3,
    [IsActive] = 1
WHERE [Id] = 'B158A1BE-FBF3-43C8-A5AF-183C1AF8F5A3';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), 'B158A1BE-FBF3-43C8-A5AF-183C1AF8F5A3', 0, '14:00', '17:00'),
    (NEWID(), 'B158A1BE-FBF3-43C8-A5AF-183C1AF8F5A3', 3, '18:00', '20:00');

-- Sophie Lefebvre (Languages, Birmingham)
UPDATE [TutorProfiles]
SET [BaseLatitude] = 52.4862,
    [BaseLongitude] = -1.8904,
    [Location] = geography::Point(52.4862, -1.8904, 4326),
    [TravelRadiusMiles] = 12,
    [HasDbs] = 1,
    [AverageRating] = 4.6,
    [ReviewCount] = 4,
    [IsActive] = 1
WHERE [Id] = 'FC54AAC4-A40B-45B1-B4D1-A249C9AE1187';

INSERT INTO [AvailabilitySlots] ([Id], [TutorProfileId], [DayOfWeek], [StartTime], [EndTime]) VALUES
    (NEWID(), 'FC54AAC4-A40B-45B1-B4D1-A249C9AE1187', 0, '10:00', '12:00'),
    (NEWID(), 'FC54AAC4-A40B-45B1-B4D1-A249C9AE1187', 2, '17:00', '19:00');

COMMIT;
