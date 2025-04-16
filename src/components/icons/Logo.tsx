

const Logo = () => {
  return (
    <img 
        src="/logo.svg" 
        alt="Medical Home Logo" 
        className="header-logo"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/150x50?text=Medical+Home';
        }}
    />
  )
}

export default Logo
