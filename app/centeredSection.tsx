const CenteredSection = (content: any) => {
  return (
      <section ref={missionSectionRef} className="pt-16 pb-16 px-8 relative min-h-[30vh] flex text-center mx-auto bg-[#f0efeb]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="my-auto flex-1">
            <h2 className={`text-4xl font-bold mb-6 text-yellow-700 transition-all duration-1500 ease-out ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>{content.home.mission.title}</h2>
            <p className={`text-lg text-black/90 leading-relaxed transition-all duration-1500 ease-out ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`} style={{ transitionDelay: '200ms' }}>{content.home.mission.content}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CenteredSection