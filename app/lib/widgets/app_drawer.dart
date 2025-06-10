//app_drawer.dart
import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Color(0xFFDCECCF)),
            child: Text(
              'GrowSmart Menu',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/home');
            },
          ),
          ListTile(
            leading: const Icon(Icons.agriculture),
            title: const Text('My Farms'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/farm');
            },
          ),
          ListTile(
            leading: const Icon(Icons.eco),
            title: const Text('My Crops'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/crops');
            },
          ),
          ListTile(
            leading: const Icon(Icons.chat_bubble_outline),
            title: const Text('AgriBot'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/agribot');
            },
          ),
          ListTile(
            leading: const Icon(Icons.group),
            title: const Text('AgriFriend'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/agrifriend');
            },
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/profile');
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Settings coming soon!')),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/sign-in',
                (route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}
