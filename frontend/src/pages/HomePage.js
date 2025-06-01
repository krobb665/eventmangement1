import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'url(https://www.vfairs.com/hubfs/Backgrounds/hero-bg-2.png)',
    backgroundSize: 'cover',
    opacity: 0.1,
    zIndex: 1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  border: 'none',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #3f51b5 0%, #1a237e 100%)',
  color: 'white',
  '& svg': {
    fontSize: 32,
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(1, 0),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&.Mui-expanded': {
    minHeight: 56,
  },
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(1, 0),
    },
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  // State for accordion expansion
  const [expanded, setExpanded] = React.useState(false);
  
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-up');
    }
  };

  const handleDemoRequest = (e) => {
    e.preventDefault();
    // Handle demo request submission
    console.log('Demo requested');
  };

  const features = [
    {
      icon: <PeopleIcon />,
      title: 'Virtual & Hybrid Events',
      description: 'Host engaging virtual and hybrid events with our immersive platform that connects audiences worldwide.'
    },
    {
      icon: <BarChartIcon />,
      title: 'Powerful Analytics',
      description: 'Get real-time insights and comprehensive analytics to measure your event success.'
    },
    {
      icon: <PersonIcon />,
      title: 'Networking Tools',
      description: 'Foster meaningful connections with AI-powered matchmaking and networking features.'
    },
  ];

  const faqs = [
    {
      question: 'What types of events can I host?',
      answer: 'Our platform supports conferences, trade shows, career fairs, product launches, corporate meetings, and more.'
    },
    {
      question: 'Do you offer custom branding?',
      answer: 'Yes, our platform is fully customizable to match your brand identity, including colors, logos, and messaging.'
    },
    {
      question: 'How does the pricing work?',
      answer: 'We offer flexible pricing based on your event size and requirements. Contact us for a personalized quote.'
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                fontWeight={700}
                gutterBottom
                sx={{
                  color: 'white',
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Elevate Your Events with Our All-in-One Platform
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Create unforgettable virtual, hybrid, and in-person events with our comprehensive event management platform.
                Engage your audience like never before with powerful features designed for success.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<PlayCircleIcon />}
                  onClick={handleDemoRequest}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Box 
                      key={i}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        ml: i > 1 ? -1.5 : 0,
                        border: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 5 - i,
                        fontSize: '0.875rem',
                      }}
                    >
                      {i}
                    </Box>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Trusted by 10,000+ event professionals worldwide
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.3) 0%, rgba(40, 53, 147, 0.3) 100%)',
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://www.vfairs.com/hubfs/vFairs-2021/Images/hero-dashboard.png"
                  alt="Event Management Platform"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: 'relative',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    textAlign: 'center',
                  }}
                >
                  <IconButton
                    onClick={handleDemoRequest}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'secondary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    <PlayCircleIcon sx={{ fontSize: 48 }} />
                  </IconButton>
                  <Typography variant="subtitle1" color="white" sx={{ mt: 2, fontWeight: 600 }}>
                    Watch Platform Demo
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Logo Cloud */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="subtitle2" 
            textAlign="center" 
            color="text.secondary"
            sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
          >
            Trusted by Leading Companies Worldwide
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 4, md: 8 },
              '& img': {
                height: 28,
                opacity: 0.7,
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1,
                },
              }
            }}
          >
            {['microsoft', 'coca-cola', 'unilever', 'ge', 'sap'].map((company) => (
              <Box 
                key={company}
                component="img"
                src={`https://via.placeholder.com/120x40?text=${company.toUpperCase()}`}
                alt={company}
                sx={{ 
                  filter: 'grayscale(100%)',
                  '&:hover': {
                    filter: 'grayscale(0%)',
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth={800} mx="auto" mb={8}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2,
              }}
            >
              All-in-One Event Management Solution
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Everything you need to plan, promote, and execute successful events of any size or type.
              Our platform is designed to make event management seamless and efficient.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <FeatureIcon>
                      {feature.icon}
                    </FeatureIcon>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {feature.description}
                    </Typography>
                    <Button 
                      color="primary" 
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        alignSelf: 'flex-start', 
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 0,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Learn more
                    </Button>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Simple Setup, Powerful Results
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Get started quickly with our intuitive platform and start creating amazing events in minutes.
              </Typography>
              
              <List sx={{ '& .MuiListItem-root': { px: 0, py: 1.5 } }}>
                {[
                  { icon: <CheckCircleIcon color="primary" />, text: 'No technical skills required' },
                  { icon: <CheckCircleIcon color="primary" />, text: 'Drag-and-drop interface' },
                  { icon: <CheckCircleIcon color="primary" />, text: 'Pre-built templates' },
                  { icon: <CheckCircleIcon color="primary" />, text: '24/7 customer support' },
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 50,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Get Started Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box 
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <img 
                  src="https://www.vfairs.com/hubfs/vFairs-2021/Images/features-showcase-2.png" 
                  alt="Event Platform Interface"
                  style={{ width: '100%', display: 'block' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth={800} mx="auto" mb={8}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Loved by Event Professionals
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Join thousands of event organizers who trust our platform to power their events.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#FFD700', mr: 0.5 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "The platform is incredibly intuitive and our attendees loved the experience. 
                    The support team was exceptional throughout our entire event journey."
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Sarah Johnson
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Event Director, TechConf 2023
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Find answers to common questions about our platform and services.
            </Typography>
          </Box>
          
          <Box>
            {faqs.map((faq, index) => (
              <StyledAccordion 
                key={index} 
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                >
                  <Typography variant="h6" sx={{ flexShrink: 0 }}>
                    {faq.question}
                  </Typography>
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Box 
            sx={{
              p: 6,
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'white',
              textAlign: 'center',
              backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'url(https://www.vfairs.com/hubfs/Backgrounds/hero-bg-2.png)',
                backgroundSize: 'cover',
                opacity: 0.1,
                zIndex: 1,
              },
            }}
          >
            <Box position="relative" zIndex={2}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Ready to Transform Your Events?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of event professionals who trust our platform to create 
                unforgettable experiences.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    px: 6,
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={handleDemoRequest}
                  startIcon={<PhoneIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                    py: 1.8,
                    px: 6,
                    fontSize: '1.1rem',
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Request a Demo
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of event professionals who trust our platform
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 1.5,
              px: 6,
              fontSize: '1.1rem',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                EventPro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The all-in-one platform for seamless event management, from planning to execution.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Product
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Features', 'Pricing', 'Integrations', 'Updates'].map((item) => (
                  <li key={item}>
                    <Typography 
                      component={Link} 
                      to={`/${item.toLowerCase()}`}
                      color="text.secondary"
                      sx={{ 
                        display: 'block', 
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {item}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Company
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <Typography 
                      component={Link} 
                      to={`/${item.toLowerCase()}`}
                      color="text.secondary"
                      sx={{ 
                        display: 'block', 
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {item}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Stay Updated
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Subscribe to our newsletter for the latest updates and news.
              </Typography>
              <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    fontSize: '0.9375rem',
                  }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © {new Date().getFullYear()} EventPro. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
