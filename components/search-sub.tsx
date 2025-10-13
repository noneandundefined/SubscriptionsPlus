import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

interface SearchSubInputProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	colorScheme: any;
}

export const SearchSubInput: React.FC<SearchSubInputProps> = ({ searchQuery, setSearchQuery, colorScheme }) => {
	const [localSearch, setLocalSearch] = useState<string>(searchQuery);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			setSearchQuery(localSearch);
		}, 500);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [localSearch]);

	return (
		<View>
			<TextInput
				value={localSearch}
				onChangeText={setLocalSearch}
				style={{
					color: colorScheme === 'dark' ? '#fff' : '#000',
					backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
					borderWidth: 1,
					marginHorizontal: 10,
					marginBottom: 10,
					fontSize: 15,
					borderRadius: 25,
					height: 55,
					paddingHorizontal: 15,
					borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
				}}
				placeholder="Search subscription..."
				placeholderTextColor={colorScheme === 'dark' ? '#949494ff' : '#949494ff'}
			/>
		</View>
	);
};
