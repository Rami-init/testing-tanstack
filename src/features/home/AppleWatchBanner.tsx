import AppleWatchFaceImage from "@/assets/apple-watch-face.png";
import AppleWatchSideImage from "@/assets/apple-watch-side.png";

const AppleWatchBanner = () => {
	return (
		<section className="flex bg-black items-center justify-center container mx-auto py-10 gap-x-20 w-full rounded-4xl mt-20 mb-10">
			<img
				src={AppleWatchFaceImage}
				alt="Apple Watch Face"
				className="w-54 h-auto"
			/>
			<h1 className="text-white text-5xl font-semibold">Apple Watch Series</h1>
			<img
				src={AppleWatchSideImage}
				alt="Apple Watch Side"
				className="w-54 h-auto"
			/>
		</section>
	);
};

export default AppleWatchBanner;
