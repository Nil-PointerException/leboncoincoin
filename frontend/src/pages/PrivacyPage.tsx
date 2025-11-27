import { Container, Paper, Typography, Box, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'

export default function PrivacyPage() {
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
          Politique de Confidentialité
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          LeBonCoinCoin s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            1. Responsable du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Le responsable du traitement des données personnelles est LeBonCoinCoin.
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Email :</strong> contact@leboncoincoin.com
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Contact :</strong>{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/contact')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                >
                  via notre formulaire de contact
                </Button>
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            2. Données collectées
          </Typography>
          <Typography variant="body1" paragraph>
            Nous collectons les données suivantes lorsque vous utilisez notre plateforme :
          </Typography>
          
          <Typography variant="h6" component="h3" gutterBottom fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            2.1. Données d'identification
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                Nom et prénom
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Adresse email
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Identifiant utilisateur (via Clerk)
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" component="h3" gutterBottom fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            2.2. Données de navigation
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                Adresse IP
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Type de navigateur et système d'exploitation
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Pages visitées et durée de visite
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Cookies et technologies similaires
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" component="h3" gutterBottom fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            2.3. Données liées aux annonces
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                Contenu des annonces publiées
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Images et photos
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Localisation
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Messages échangés avec d'autres utilisateurs
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            3. Finalités du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données personnelles sont utilisées pour les finalités suivantes :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Gestion de votre compte :</strong> Création, authentification et gestion de votre compte utilisateur
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Publication d'annonces :</strong> Mise en ligne et gestion de vos annonces
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Communication entre utilisateurs :</strong> Mise en relation et échange de messages
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Amélioration du service :</strong> Analyse statistique et amélioration de l'expérience utilisateur
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Sécurité :</strong> Prévention de la fraude et des abus
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Communication :</strong> Envoi d'emails de notification et d'information
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            4. Base légale du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Le traitement de vos données personnelles est fondé sur :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Votre consentement :</strong> Pour l'utilisation de cookies non essentiels
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>L'exécution d'un contrat :</strong> Pour la fourniture des services de la plateforme
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>L'intérêt légitime :</strong> Pour la sécurité et l'amélioration du service
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>L'obligation légale :</strong> Pour la conservation de certaines données
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            5. Partage des données
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données personnelles ne sont pas vendues à des tiers. Elles peuvent être partagées dans les cas suivants :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Prestataires de services :</strong> Nous utilisons des services tiers (hébergement AWS, authentification Clerk) qui peuvent avoir accès à certaines données dans le cadre de leurs prestations
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Obligations légales :</strong> En cas d'obligation légale ou de demande judiciaire
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Protection de nos droits :</strong> Pour protéger nos droits, notre propriété ou notre sécurité
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            6. Durée de conservation
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données personnelles sont conservées pour les durées suivantes :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Données de compte :</strong> Pendant la durée de votre compte et 3 ans après sa suppression
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Annonces :</strong> Pendant la durée de publication et 1 an après leur suppression
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Messages :</strong> Pendant la durée de la conversation et 1 an après sa clôture
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Données de navigation :</strong> 13 mois maximum
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            7. Vos droits
          </Typography>
          <Typography variant="body1" paragraph>
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit d'accès :</strong> Vous pouvez demander l'accès à vos données personnelles
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit de rectification :</strong> Vous pouvez demander la correction de données inexactes
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit à la limitation :</strong> Vous pouvez demander la limitation du traitement
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit à la portabilité :</strong> Vous pouvez demander la récupération de vos données dans un format structuré
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Droit de retirer votre consentement :</strong> Pour les traitements basés sur le consentement
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Pour exercer ces droits, vous pouvez nous contacter à l'adresse{' '}
            <Button
              variant="text"
              onClick={() => navigate('/contact')}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
            >
              contact@leboncoincoin.com
            </Button>
            {' '}ou via notre{' '}
            <Button
              variant="text"
              onClick={() => navigate('/contact')}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto', textDecoration: 'underline' }}
            >
              formulaire de contact
            </Button>.
          </Typography>
          <Typography variant="body1" paragraph>
            Vous avez également le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            8. Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil.
          </Typography>
          <Typography variant="body1" paragraph>
            Types de cookies utilisés :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, sécurité)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Cookies de performance :</strong> Pour analyser l'utilisation du site et améliorer nos services
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                <strong>Cookies de préférences :</strong> Pour mémoriser vos préférences (langue, région)
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            9. Sécurité
          </Typography>
          <Typography variant="body1" paragraph>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction.
          </Typography>
          <Typography variant="body1" paragraph>
            Ces mesures incluent notamment :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" component="span">
                Chiffrement des données en transit (HTTPS)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Authentification sécurisée via Clerk
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Hébergement sécurisé sur AWS
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Accès restreint aux données personnelles
              </Typography>
            </li>
            <li>
              <Typography variant="body1" component="span">
                Sauvegardes régulières
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            10. Transferts internationaux
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données peuvent être transférées et stockées sur des serveurs situés en dehors de l'Union Européenne (notamment aux États-Unis pour l'hébergement AWS et l'authentification Clerk).
          </Typography>
          <Typography variant="body1" paragraph>
            Ces transferts sont encadrés par des garanties appropriées conformément au RGPD, notamment les clauses contractuelles types de la Commission Européenne.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            11. Modifications
          </Typography>
          <Typography variant="body1" paragraph>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page.
          </Typography>
          <Typography variant="body1" paragraph>
            Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance de la version la plus récente de notre politique de confidentialité.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            12. Contact
          </Typography>
          <Typography variant="body1" paragraph>
            Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :
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
