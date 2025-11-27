import { Container, Paper, Typography, Box, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'

export default function LegalPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Mentions Légales
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            1. Éditeur du site
          </Typography>
          <Typography variant="body1" paragraph>
            Le site <strong>LeBonCoinCoin</strong> est édité par :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Raison sociale :</strong> LeBonCoinCoin
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Forme juridique :</strong> [À compléter]
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Siège social :</strong> [À compléter]
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>SIRET :</strong> [À compléter]
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Email :</strong> contact@leboncoincoin.com
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            2. Directeur de publication
          </Typography>
          <Typography variant="body1" paragraph>
            Le directeur de la publication est le représentant légal de l'éditeur.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            3. Hébergement
          </Typography>
          <Typography variant="body1" paragraph>
            Le site est hébergé par :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Hébergeur :</strong> Amazon Web Services (AWS)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Adresse :</strong> Amazon Web Services, Inc., 410 Terry Avenue North, Seattle, WA 98109-5210, États-Unis
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Site web :</strong> https://aws.amazon.com
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            4. Propriété intellectuelle
          </Typography>
          <Typography variant="body1" paragraph>
            L'ensemble des éléments du site LeBonCoinCoin (textes, images, vidéos, logos, icônes, etc.) sont la propriété exclusive de LeBonCoinCoin, sauf mention contraire.
          </Typography>
          <Typography variant="body1" paragraph>
            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de LeBonCoinCoin.
          </Typography>
          <Typography variant="body1" paragraph>
            Toute exploitation non autorisée du site ou de son contenu engage la responsabilité civile et/ou pénale de l'utilisateur.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            5. Responsabilité
          </Typography>
          <Typography variant="body1" paragraph>
            LeBonCoinCoin s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Cependant, LeBonCoinCoin ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site.
          </Typography>
          <Typography variant="body1" paragraph>
            LeBonCoinCoin ne saurait être tenu responsable :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                Des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Des bugs, interruptions ou erreurs pouvant survenir sur le site
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                De la perte de données ou autres dommages résultant de l'utilisation du site
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Du contenu des annonces publiées par les utilisateurs
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Des transactions effectuées entre utilisateurs
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            6. Données personnelles
          </Typography>
          <Typography variant="body1" paragraph>
            Les données personnelles collectées sur le site sont traitées conformément à la réglementation en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
          </Typography>
          <Typography variant="body1" paragraph>
            Pour plus d'informations sur le traitement de vos données personnelles, consultez notre{' '}
            <Button
              variant="text"
              onClick={() => navigate('/privacy')}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
            >
              Politique de Confidentialité
            </Button>.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            7. Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à utiliser le site, vous acceptez l'utilisation de cookies conformément à notre politique de cookies.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            8. Liens externes
          </Typography>
          <Typography variant="body1" paragraph>
            Le site peut contenir des liens vers d'autres sites web. LeBonCoinCoin n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            9. Loi applicable et juridiction compétente
          </Typography>
          <Typography variant="body1" paragraph>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            10. Contact
          </Typography>
          <Typography variant="body1" paragraph>
            Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Email :</strong>{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/contact')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                >
                  contact@leboncoincoin.com
                </Button>
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Formulaire de contact :</strong>{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/contact')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                >
                  via notre page de contact
                </Button>
              </Typography>
            </li>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

