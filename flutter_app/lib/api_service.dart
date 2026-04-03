import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class ApiService {
  // Production backend URL
  static const String baseUrl = 'https://baptist-church-onitiri.onrender.com';

  static Future<ChurchData> fetchChurchData() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/public/view'))
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return ChurchData.fromJson(jsonData);
      } else {
        throw Exception('Failed to load church data: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching data: $e');
    }
  }
}
