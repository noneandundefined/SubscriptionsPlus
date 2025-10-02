import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserCreateScreen() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView>
            <View>
                <Image source={require('@/assets/images/sub-icon-base.png')} style={{ maxWidth: 60, maxHeight: 60 }} />
                <ThemedText>Create your account</ThemedText>
            </View>

            <TextInput
                style={{
                    color: colorScheme === 'dark' ? '#fff' : '#000',
                    backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
                    borderWidth: 1,
                    marginHorizontal: 10,
                    marginBottom: 15,
                    fontSize: 15,
                    borderRadius: 25,
                    height: 55,
                    paddingHorizontal: 15,
                    borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
                }}
                placeholder="Search subscription..."
                placeholderTextColor={colorScheme === 'dark' ? '#949494ff' : '#949494ff'}
            />
        </SafeAreaView>
    );
}
