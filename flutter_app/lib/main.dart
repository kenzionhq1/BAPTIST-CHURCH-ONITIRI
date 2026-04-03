import 'package:flutter/material.dart';
import 'models.dart';
import 'api_service.dart';

void main() {
  runApp(const ChurchApp());
}

class ChurchApp extends StatelessWidget {
  const ChurchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Baptist Church Onitiri',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<ChurchData> churchDataFuture;

  @override
  void initState() {
    super.initState();
    churchDataFuture = ApiService.fetchChurchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Baptist Church Onitiri'),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: FutureBuilder<ChurchData>(
        future: churchDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 60, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading data',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    snapshot.error.toString(),
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        churchDataFuture = ApiService.fetchChurchData();
                      });
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (snapshot.hasData) {
            final churchData = snapshot.data!;
            return RefreshIndicator(
              onRefresh: () async {
                setState(() {
                  churchDataFuture = ApiService.fetchChurchData();
                });
              },
              child: ListView(
                children: [
                  // Header
                  Container(
                    color: Colors.blue,
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        const Text(
                          '🙏',
                          style: TextStyle(fontSize: 48),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Baptist Church Onitiri, Yaba',
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall!
                              .copyWith(color: Colors.white),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Welcome to our digital home',
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge!
                              .copyWith(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),

                  // Latest Sermons
                  _buildSection(
                    context,
                    'Latest Sermons',
                    churchData.sermons.isEmpty
                        ? const Center(child: Text('No sermons available'))
                        : Column(
                            children: churchData.sermons
                                .take(3)
                                .map((sermon) =>
                                    _buildSermonCard(context, sermon))
                                .toList(),
                          ),
                  ),

                  // Upcoming Events
                  _buildSection(
                    context,
                    'Upcoming Events',
                    churchData.upcomingEvents.isEmpty
                        ? const Center(child: Text('No upcoming events'))
                        : Column(
                            children: churchData.upcomingEvents
                                .map((event) =>
                                    _buildEventCard(context, event))
                                .toList(),
                          ),
                  ),

                  // Past Events
                  if (churchData.pastEvents.isNotEmpty)
                    _buildSection(
                      context,
                      'Past Events',
                      Column(
                        children: churchData.pastEvents
                            .take(3)
                            .map((event) =>
                                _buildEventCard(context, event))
                            .toList(),
                      ),
                    ),

                  const SizedBox(height: 24),
                ],
              ),
            );
          } else {
            return const Center(child: Text('No data available'));
          }
        },
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, Widget content) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          content,
        ],
      ),
    );
  }

  Widget _buildSermonCard(BuildContext context, Sermon sermon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              sermon.title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'By ${sermon.speaker} • ${sermon.date}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            if (sermon.link.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Opening sermon link...')),
                    );
                  },
                  child: const Text('Watch'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildEventCard(BuildContext context, Event event) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              event.name,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              '📅 ${event.date} • 🕐 ${event.time}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            Text(
              event.summary,
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
