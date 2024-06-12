import React from "react";

export default function Test(props) {
	const { name, setName } = props;

	return (
		<div className="flex flex-col justify-center items-center ">
			<input
				type="text"
				onChange={(e) => {
					setName(e.target.value);
				}}
				className="text-center text-red-700 my-2 px-5 ring-emerald-400 bg-gray-500 w-32 "
			/>
			<p className="text-center text-blue-600 p-3 ring-1">value is : {name}</p>
		</div>
	);
}
