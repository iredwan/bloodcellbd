import { FiHeart, FiRefreshCw, FiSmile, FiUsers, FiDroplet, FiShield, FiCalendar, FiZap } from "react-icons/fi";
import { GiDrop } from "react-icons/gi";

export default function BloodBenefits() {
  const benefits = [
    {
      title: "Physical Benefits",
      items: [
        { icon: <FiHeart className="w-5 h-5 text-red-600" />, text: "Improves heart health - Reduces excess iron" },
        { icon: <FiRefreshCw className="w-5 h-5 text-blue-600" />, text: "Enhances blood circulation - Stimulates new blood cell production" },
        { icon: <FiZap className="w-5 h-5 text-green-600" />, text: "Supports liver health - Helps reduce toxins" },
        { icon: <FiShield className="w-5 h-5 text-purple-600" />, text: "Aids weight management - Burns ~650 calories" },
      ],
    },
    {
      title: "Mental Benefits",
      items: [
        { icon: <FiSmile className="w-5 h-5 text-yellow-600" />, text: "Emotional satisfaction - Joy of saving lives" },
        { icon: <FiUsers className="w-5 h-5 text-teal-600" />, text: "Fulfills social responsibility - Civic engagement" },
      ],
    },
    {
      title: "Social Benefits",
      items: [
        { icon: <FiDroplet className="w-5 h-5 text-pink-600" />, text: "Saves lives in emergencies - Supports surgeries & accidents" },
        { icon: <FiCalendar className="w-5 h-5 text-indigo-600" />, text: "Maintains blood supply - Replenishes blood banks" },
      ],
    },
  ];

  return (
    <section className="container bg-gray-50 p-6 dark:bg-gray-800 rounded-lg">
      <div className="max-w-5xl mx-auto text-center mb-12">
          <GiDrop className="inline-block text-primary text-8xl mb-4" />
        <h2 className="text-4xl font-bold text-primary">
          Benefits of Blood Donation
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
          Blood donation not only saves lives but also brings physical and mental benefits to the donor
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {benefits.map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 dark:text-white dark:border-gray-600">
              {section.title}
            </h3>
            <ul className="space-y-4 text-left">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="mr-3 mt-0.5">{item.icon}</span>
                  <span className="text-base leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <blockquote className="text-xl italic text-primary font-bold max-w-3xl mx-auto">
          <FiHeart className="inline-block mr-2 -mt-1" />
          "Donate blood every 3 months - Stay healthy and give the gift of life"
        </blockquote>
      </div>
    </section>
  );
}