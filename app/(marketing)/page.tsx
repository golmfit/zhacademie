const MarketingPage = () => {
  return (
    <div className="bg-gray-100 py-12">
      <section className="hero bg-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Unlock Your Potential with Our Courses</h1>
          <p className="text-lg text-center text-gray-700 mb-12">
            Learn from industry experts and gain the skills you need to succeed.
          </p>
          <div className="flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      <section className="features py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature text-center">
              <i className="fas fa-graduation-cap text-4xl text-blue-500 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-gray-700">Learn from experienced professionals in your field.</p>
            </div>
            <div className="feature text-center">
              <i className="fas fa-laptop-code text-4xl text-blue-500 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Hands-On Projects</h3>
              <p className="text-gray-700">Apply your knowledge with real-world projects.</p>
            </div>
            <div className="feature text-center">
              <i className="fas fa-certificate text-4xl text-blue-500 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Industry-Recognized Certification</h3>
              <p className="text-gray-700">Earn a certificate to boost your career.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials py-16">
        <div className="container mx-auto px-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                "This course completely changed my career path. The instructors were amazing and the content was
                top-notch."
              </p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/50" alt="Student" className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">John Doe</p>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
            </div>
            <div className="testimonial bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                "I was able to land a job within weeks of completing the course. The skills I learned were directly
                applicable to my new role."
              </p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/50" alt="Student" className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">Jane Smith</p>
                  <p className="text-sm text-gray-500">Data Scientist</p>
                </div>
              </div>
            </div>
            <div className="testimonial bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                "The hands-on projects were invaluable. I now have a portfolio that showcases my abilities to potential
                employers."
              </p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/50" alt="Student" className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">Peter Jones</p>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta bg-blue-500 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to Transform Your Career?</h2>
          <p className="text-lg text-white mb-12">Join our community of learners and start your journey today.</p>
          <button className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-3 px-6 rounded-full">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default MarketingPage
