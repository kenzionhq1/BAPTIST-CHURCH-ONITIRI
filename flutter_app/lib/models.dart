class ChurchData {
  final FeaturedSermon? featuredSermon;
  final List<Sermon> sermons;
  final List<Event> events;
  final List<Resource> resources;

  ChurchData({
    required this.featuredSermon,
    required this.sermons,
    required this.events,
    required this.resources,
  });

  factory ChurchData.fromJson(Map<String, dynamic> json) {
    return ChurchData(
      featuredSermon: json['featuredSermon'] != null
          ? FeaturedSermon.fromJson(json['featuredSermon'])
          : null,
      sermons: (json['itemsByCategory']?['sermon'] as List?)
              ?.map((e) => Sermon.fromJson(e))
              .toList() ??
          [],
      events: (json['itemsByCategory']?['event'] as List?)
              ?.map((e) => Event.fromJson(e))
              .toList() ??
          [],
      resources: (json['itemsByCategory']?['resource'] as List?)
              ?.map((e) => Resource.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class FeaturedSermon {
  final String title;
  final String date;
  final String speaker;
  final String embed;

  FeaturedSermon({
    required this.title,
    required this.date,
    required this.speaker,
    required this.embed,
  });

  factory FeaturedSermon.fromJson(Map<String, dynamic> json) {
    return FeaturedSermon(
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      speaker: json['speaker'] ?? '',
      embed: json['embed'] ?? '',
    );
  }
}

class Sermon {
  final String title;
  final String date;
  final String speaker;
  final String category;
  final String link;

  Sermon({
    required this.title,
    required this.date,
    required this.speaker,
    required this.category,
    required this.link,
  });

  factory Sermon.fromJson(Map<String, dynamic> json) {
    return Sermon(
      title: json['title'] ?? 'Untitled Sermon',
      date: json['date'] ?? '',
      speaker: json['speaker'] ?? 'Unknown',
      category: json['category'] ?? '',
      link: json['link'] ?? '',
    );
  }
}

class Event {
  final String name;
  final String date;
  final String time;
  final String summary;
  final String placement;
  final String link;

  Event({
    required this.name,
    required this.date,
    required this.time,
    required this.summary,
    required this.placement,
    required this.link,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      name: json['title'] ?? 'Untitled Event',
      date: json['date'] ?? '',
      time: json['eventTime'] ?? '',
      summary: json['summary'] ?? '',
      placement: json['eventPlacement'] ?? 'upcoming',
      link: json['link'] ?? '',
    );
  }
}

class Resource {
  final String title;
  final String date;
  final String file;

  Resource({
    required this.title,
    required this.date,
    required this.file,
  });

  factory Resource.fromJson(Map<String, dynamic> json) {
    return Resource(
      title: json['title'] ?? 'Untitled Resource',
      date: json['date'] ?? '',
      file: json['fileUrl'] ?? json['file'] ?? '',
    );
  }
}
