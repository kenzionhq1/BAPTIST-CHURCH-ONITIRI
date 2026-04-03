class Sermon {
  final String id;
  final String title;
  final String date;
  final String speaker;
  final String link;
  final String image;

  Sermon({
    required this.id,
    required this.title,
    required this.date,
    required this.speaker,
    required this.link,
    required this.image,
  });

  factory Sermon.fromJson(Map<String, dynamic> json) {
    return Sermon(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Untitled Sermon',
      date: json['date'] ?? '',
      speaker: json['speaker'] ?? 'Unknown Speaker',
      link: json['link'] ?? '',
      image: json['image'] ?? '',
    );
  }
}

class Event {
  final String id;
  final String name;
  final String date;
  final String time;
  final String summary;
  final String cover;
  final String placement;

  Event({
    required this.id,
    required this.name,
    required this.date,
    required this.time,
    required this.summary,
    required this.cover,
    required this.placement,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Untitled Event',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      summary: json['summary'] ?? '',
      cover: json['cover'] ?? '',
      placement: json['placement'] ?? 'upcoming',
    );
  }
}

class ChurchData {
  final List<Sermon> sermons;
  final List<Event> upcomingEvents;
  final List<Event> pastEvents;

  ChurchData({
    required this.sermons,
    required this.upcomingEvents,
    required this.pastEvents,
  });

  factory ChurchData.fromJson(Map<String, dynamic> json) {
    final itemsByCategory = json['itemsByCategory'] ?? {};
    final sermonsList = (itemsByCategory['sermon'] as List<dynamic>?)
            ?.map((e) => Sermon.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    final allEvents = (itemsByCategory['event'] as List<dynamic>?)
            ?.map((e) => Event.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    final upcomingEvents =allEvents.where((e) => e.placement == 'upcoming').toList();
    final pastEvents = allEvents.where((e) => e.placement == 'past').toList();

    return ChurchData(
      sermons: sermonsList,
      upcomingEvents: upcomingEvents,
      pastEvents: pastEvents,
    );
  }
}
