import { categoriesData } from "@/lib/categoriesData";

const Categories = () => {
	return (
		<div className="flex flex-col gap-8 py-25 container mx-auto px-4 md:px-8 lg:px-16 items-center justify-center">
			<h1 className="font-bold text-4xl text-heading">
				Newest Collection Available
			</h1>
			<div className="flex items-center gap-2.5">
				{categoriesData.map((category) => (
					<div
						key={category.id}
						className="flex flex-col gap-4 cursor-pointer hover:shadow-lg p-4 rounded-lg items-center transition duration-300 ease-in-out"
					>
						<img
							src={category.image}
							alt={category.name}
							width={120}
							height={78}
							className="rounded-lg object-cover w-30 h-19.5"
						/>
						<h2 className="font-semibold text-lg text-center">
							{category.name}
						</h2>
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
