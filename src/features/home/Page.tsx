import { Outlet } from "@tanstack/react-router";
import AppleWatchBanner from "./AppleWatchBanner";
import AppleWatchProducts from "./AppleWatchProducts";
import Categories from "./Categories";
import Header from "./HomeHeader";
import IphoneBanner from "./IphoneBanner";
import IphoneCollection from "./IphoneCollection";
import NewsLetterSection from "./NewsLetterSection";
import Footer from "@/components/Footer";

const Page = () => {
	return (
		<div className="flex flex-col">
			<Header />
			<Categories />
			<IphoneBanner />
			<IphoneCollection />
			<AppleWatchBanner />
			<AppleWatchProducts />
			<NewsLetterSection />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Page;
