import ProfileSection from "../components/pages/ProfileSection";
import ContentSection from "../components/pages/ContentSection";
import FAQSection from "../components/pages/FAQSection";
import Header from "../components/pages/Header";
import Footer from "../components/pages/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <ProfileSection />
      <ContentSection />
      <FAQSection />
      <Footer />
    </>
  );
}
