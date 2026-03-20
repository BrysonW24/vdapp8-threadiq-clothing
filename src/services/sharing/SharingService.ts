/**
 * ThreadIQ Sharing Service
 * Generates share cards and handles social sharing
 */

import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

class SharingService {
  /**
   * Check if sharing is available on this device
   */
  async isAvailable(): Promise<boolean> {
    return Sharing.isAvailableAsync();
  }

  /**
   * Share a photo/image URI with optional message
   */
  async shareImage(imageUri: string, message?: string): Promise<void> {
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Sharing is not available on this device');
    }

    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share your outfit',
      UTI: 'public.jpeg',
    });
  }

  /**
   * Share a text message (for platforms that support text sharing)
   */
  async shareText(title: string, message: string, url?: string): Promise<void> {
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Sharing is not available on this device');
    }

    // On iOS, we can use the native share sheet
    // For text sharing, create a temporary text file or use native APIs
    // For now, just share the URL if available
    if (url) {
      await Sharing.shareAsync(url, {
        dialogTitle: title,
      });
    }
  }

  /**
   * Generate a shareable outfit description
   */
  generateShareCaption(
    eventTitle: string,
    items: { name: string; brand?: string }[],
  ): string {
    const itemList = items
      .map((i) => (i.brand ? `${i.brand} ${i.name}` : i.name))
      .join(', ');

    return `My outfit for ${eventTitle}: ${itemList}\n\nStyled with ThreadIQ`;
  }
}

export default new SharingService();
