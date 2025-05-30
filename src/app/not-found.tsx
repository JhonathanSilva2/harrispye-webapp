import Link from "next/link";

export default function NotFound() {
	return (
		<div className="mx-2 flex-1 md:mx-6">
			<div className="mx-auto flex h-screen items-center justify-center">
				<div className="max-w-2xl text-center">
					<div className="float-animation mb-8">
						<span className="text-9xl">👻</span>
						<h1 className="mt-4 text-9xl font-black">404</h1>
					</div>

					<h2 className="mb-6 text-3xl font-bold md:text-4xl">
						Oops! Page Not Found
					</h2>

					<p className="mb-8 text-lg">
						It looks like the content you&apos;re looking for has
						vanished... Please report the issue or return to the
						home page!
					</p>

					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Link
							href="/"
							className="rounded-lg bg-gray-200 px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-gray-300 hover:shadow-sm dark:bg-gray-900 dark:hover:bg-gray-800"
						>
							Back to Homepage
						</Link>
						<Link
							href="/contato"
							className="rounded-lg bg-gray-200 px-6 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-20 hover:backdrop-blur dark:bg-gray-900 dark:hover:bg-gray-800"
						>
							Report Issue
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
