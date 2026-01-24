import { ProductCard } from "./PordcutCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { fakeDataIphoneProducts } from "@/lib/iphones-products";

const AppleWatchProducts = () => {
	return (
		<div className="container mx-auto">
			<Carousel className="w-full blur-lg/10">
				<CarouselContent className="-ml-1 ">
					{fakeDataIphoneProducts.map((product) => (
						<CarouselItem
							key={product.id}
							className="pl-1 md:basis-1/2 lg:basis-1/5"
						>
							<div className="p-1">
								<ProductCard product={product} />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="backdrop-blur-sm bg-white/80 shadow-lg border-white/20 hover:bg-white/90" />
				<CarouselNext className="backdrop-blur-sm bg-white/80 shadow-lg border-white/20 hover:bg-white/90" />
			</Carousel>
		</div>
	);
};

export default AppleWatchProducts;
