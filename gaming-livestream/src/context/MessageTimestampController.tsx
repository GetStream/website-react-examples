import {createContext, MouseEventHandler, ReactNode, useCallback, useContext, useState} from "react";

export type TimestampContextValue = {
	timestampEnabled: boolean;
	toggleTimestamp: MouseEventHandler<HTMLUListElement>;
}

const TimestampContext = createContext<TimestampContextValue>({
	timestampEnabled: false,
	toggleTimestamp: () => null
});

export const MessageTimestampController = ({children}: { children: ReactNode }) => {
	const [timestampEnabled, setShowTimestamp] = useState(false);

	const toggleTimestamp: MouseEventHandler<HTMLUListElement> = useCallback(() => {
		setShowTimestamp((prev) => !prev);
	}, []);

	return (
		<TimestampContext.Provider value={{timestampEnabled, toggleTimestamp}}>
			{children}
		</TimestampContext.Provider>
	);
};

export const useMessageTimestamp = () => useContext(TimestampContext);

