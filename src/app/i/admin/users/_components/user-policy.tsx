import React from "react";

interface Props {
	userAttributes: unknown;
}

const UserAttributes = ({ userAttributes }: Props) => {
	return (
		<div className="grid gap-4 py-4">
			<div className="grid grid-cols-4 items-center gap-4">
				<pre>{JSON.stringify(userAttributes, null, 4)}</pre>
			</div>
			<div className="grid grid-cols-4 items-center gap-4"></div>
		</div>
	);
};

export default UserAttributes;
