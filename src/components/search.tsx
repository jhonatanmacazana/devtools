// import { type AutocompleteState, createAutocomplete } from "@algolia/autocomplete-core";
// import { useState } from "react";

export const Search = () => <div>Search</div>;

// export const Search = <T extends Record<string, unknown> = Record<string, unknown>>() => {
//   const [autocompleteState, setAutocompleteState] = useState<AutocompleteState<T>>({
//     isOpen: false,
//     collections: [],
//   });

//   const autocomplete = createAutocomplete<T>({
//     onStateChange: ({ state }) => setAutocompleteState(state),
//     getSources: () => [{ sourceId: "default", getItems: async (query) => {} }],
//   });
//   return (
//     <form className="mb-20 flex justify-center">
//       <div className="flex items-center">
//         <input type="text" className="w-full rounded-lg border px-4 py-2" placeholder="Search" />
//       </div>
//     </form>
//   );
// };
