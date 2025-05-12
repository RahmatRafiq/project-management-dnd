export default function WorkflowSection() {
  const workflowItems = [
    {
      title: "Typography",
      desc: "Typography is the art and technique of arranging type to make written language legible and appealing.",
      img: "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Automation",
      desc: "Automation helps you save time by automating repetitive tasks with ease and elegance.",
      img: "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Knowledge Management",
      desc: "Ensure all your resources are at your fingertips with smart knowledge management.",
      img: "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section
      id="workflow"
      className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Your Workflow, Your Way
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          All your projects, tasks, and notes in one place – beautifully organized.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflowItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6 text-left text-black">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
