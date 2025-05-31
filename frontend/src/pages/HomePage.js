import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  alpha,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Event as EventIcon, 
  People as PeopleIcon, 
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Unsplash Image URLs
const HERO_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
const FEATURE_IMAGES = [
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1519671482749-5f87a9f776ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
];
const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1465&q=80';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    minHeight: 'auto',
    padding: '100px 0',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
    '& .feature-image': {
      transform: 'scale(1.05)',
    },
    '& .MuiCardContent-root': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const FeatureImage = styled(CardMedia)({
  height: 200,
  transition: 'transform 0.5s ease',
});

const AnimatedButton = styled(Button)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
});

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      image: FEATURE_IMAGES[0],
      icon: <EventIcon fontSize="large" color="primary" />,
      title: 'Event Planning',
      description: 'Create and manage all your events in one place. Keep track of important dates, venues, and attendees with our intuitive dashboard.'
    },
    {
      image: FEATURE_IMAGES[1],
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Guest Management',
      description: 'Easily manage your guest lists, send beautiful invitations, and track RSVPs in real-time with our comprehensive tools.'
    },
    {
      image: FEATURE_IMAGES[2],
      icon: <RestaurantIcon fontSize="large" color="primary" />,
      title: 'Vendor Coordination',
      description: 'Connect with trusted vendors, manage contracts, and keep all your event details organized in one place.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Events Planned', icon: <EventIcon color="primary" fontSize="large" /> },
    { value: '500+', label: 'Happy Clients', icon: <PeopleIcon color="primary" fontSize="large" /> },
    { value: '24/7', label: 'Support', icon: <CheckCircleIcon color="primary" fontSize="large" /> },
    { value: '50+', label: 'Cities', icon: <LocationIcon color="primary" fontSize="large" /> }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <InstagramIcon />, url: '#' },
    { icon: <LinkedInIcon />, url: '#' },
  ];

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      {/* Add global styles for smooth scrolling */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      {/* Hero Section */}
      <HeroSection>
        <Box
          component="img"
          src={HERO_IMAGE}
          alt="Event Management"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Create Unforgettable Events
              </Typography>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                component="h2" 
                sx={{ 
                  mb: 4,
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '90%',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                The all-in-one platform for seamless event management, from planning to execution.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <AnimatedButton
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Get Started Free
                </AnimatedButton>
                <AnimatedButton
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderWidth: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign In
                </AnimatedButton>
              </Stack>
              
              {/* Social Proof */}
              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Box 
                      key={i} 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        ml: i > 1 ? -1.5 : 0,
                        border: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 5 - i
                      }}
                    >
                      {i}
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Trusted by 5,000+ event planners worldwide
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Box key={star} sx={{ color: '#FFD700', fontSize: '1.1rem' }}>★</Box>
                    ))}
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', ml: 0.5 }}>5.0</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src={HERO_IMAGE} 
                alt="Event Management"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 600,
                  display: 'block',
                  mx: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(0)',
                  animation: 'float 8s ease-in-out infinite',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0px)' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
        mt: { xs: 0, md: -10 },
        mb: { xs: 6, md: 12 },
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <StatCard>
                  <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                  <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" fontWeight={500}>
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, position: 'relative', bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={{ xs: 6, md: 10 }}>
            <Typography 
              variant="overline" 
              color="primary" 
              fontWeight="bold"
              sx={{
                display: 'inline-block',
                mb: 2,
                letterSpacing: 2,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
              }}
            >
              Why Choose Us
            </Typography>
            <Typography 
              variant={isMobile ? 'h3' : 'h2'} 
              component="h2" 
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Everything You Need to Create
              <Box component="span" sx={{ color: 'primary.main' }}> Unforgettable Events</Box>
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              sx={{
                maxWidth: 700,
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Our comprehensive platform provides all the tools you need to plan, manage, and execute successful events with ease.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard>
                  <FeatureImage
                    className="feature-image"
                    component="img"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: 'primary.main', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: 'white'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          py: { xs: 12, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography 
              variant={isMobile ? 'h3' : 'h2'} 
              component="h2" 
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                color: 'white'
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5, 
                opacity: 0.9,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.7
              }}
            >
              Join thousands of event professionals who trust our platform to make their events unforgettable.
              Start your free trial today, no credit card required.
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                bgcolor: 'white',
                color: theme.palette.secondary.main,
                px: 6,
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  bgcolor: 'white',
                  boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="overline" 
                color="primary" 
                fontWeight="bold"
                sx={{
                  display: 'inline-block',
                  mb: 2,
                  letterSpacing: 1,
                }}
              >
                Contact Us
              </Typography>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h2" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3
                }}
              >
                Get In Touch
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                Have questions or need assistance? Our team is here to help you with any inquiries about our platform or services.
              </Typography>
              
              <Box sx={{ '& > div': { display: 'flex', alignItems: 'center', mb: 2.5 } }}>
                <Box>
                  <EmailIcon color="primary" sx={{ mr: 2, fontSize: 24 }} />
                </Box>
                <Typography>support@eventmanager.com</Typography>
              </Box>
              <Box sx={{ '& > div': { display: 'flex', alignItems: 'center', mb: 2.5 } }}>
                <Box>
                  <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 24 }} />
                </Box>
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ '& > div': { display: 'flex', alignItems: 'flex-start' } }}>
                <Box>
                  <LocationIcon color="primary" sx={{ mr: 2, mt: 0.5, fontSize: 24 }} />
                </Box>
                <Typography>
                  123 Event Street<br />
                  San Francisco, CA 94107<br />
                  United States
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Send us a Message
                </Typography>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        size="small"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 10, md: 15 }, 
        bgcolor: 'primary.main', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
          zIndex: 1,
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
              Ready to Plan Your Next Event?
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
              Join thousands of event professionals who trust our platform to create memorable experiences.
            </Typography>
            <AnimatedButton
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.8,
                px: 6,
                fontSize: '1.1rem',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
              }}
            >
              Get Started Free
            </AnimatedButton>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                EventPro
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                The all-in-one platform for seamless event management, from planning to execution.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Product
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Features', 'Pricing', 'Integrations', 'Updates', 'Roadmap'].map((item) => (
                  <Box key={item} component="li" sx={{ mb: 1 }}>
                    <Button
                      component={Link}
                      to={`/${item.toLowerCase()}`}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Company
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                  <Box key={item} component="li" sx={{ mb: 1 }}>
                    <Button
                      component={Link}
                      to={`/${item.toLowerCase()}`}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Resources
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Help Center', 'Tutorials', 'Templates', 'Community', 'Events'].map((item) => (
                  <Box key={item} component="li" sx={{ mb: 1 }}>
                    <Button
                      component={Link}
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Legal
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'].map((item) => (
                  <Box key={item} component="li" sx={{ mb: 1 }}>
                    <Button
                      component={Link}
                      to={`/legal/${item.toLowerCase()}`}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} EventPro. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Typography 
                component={Link} 
                to="/privacy" 
                variant="body2" 
                color="text.secondary"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                component={Link} 
                to="/terms" 
                variant="body2" 
                color="text.secondary"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
