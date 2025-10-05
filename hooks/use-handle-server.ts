import { QueryKey, QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';

// Общий тип, определяющий контракт возврата нашего хука.
type UseHandleServerType<T, K extends string = 'data'> = {
	[P in K]: T | null;
} & {
	loading: boolean;
	reload: (options?: RefetchOptions) => Promise<QueryObserverResult<T | null, Error>>; // Обновляем тип reload
};

// Универсальный хук для отправки запросов к серверу и отслеживания состояния загрузки.
export const useHandleServer = <T>(queryKey: QueryKey, fn: (signal?: AbortSignal) => Promise<T>) => {
	const {
		data: queryData,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: queryKey,
		queryFn: ({ signal }) => fn(signal),
	});

	return {
		data: queryData,
		loading: isLoading,
		reload: refetch,
	} as UseHandleServerType<T>;
};
