import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../contexts/ThemeContext';
import {Button} from '../components/ui/Button';
import {Card} from '../components/ui/Card';
import {RootStackParamList} from '../App';

type IndexScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Index'
>;

const {width, height} = Dimensions.get('window');

const IndexScreen = () => {
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {colors, spacing, fontSize} = useTheme();

  const features = [
    {
      title: 'Conecte-se com profissionais',
      description:
        'Encontre músicos, DJs, técnicos e outros profissionais do audiovisual para seus eventos.',
      icon: '🎵',
    },
    {
      title: 'Gerencie seus eventos',
      description:
        'Crie e gerencie eventos, adicione serviços necessários e receba candidaturas de profissionais.',
      icon: '🎬',
    },
    {
      title: 'Pagamentos seguros',
      description:
        'Utilize nosso sistema de pagamento seguro com Pix, cartão de crédito ou débito.',
      icon: '✅',
    },
  ];

  const professionalTypes = [
    {name: 'Músicos', icon: '🎵'},
    {name: 'DJs', icon: '🎧'},
    {name: 'Fotógrafos', icon: '📷'},
    {name: 'Filmmakers', icon: '🎬'},
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    heroSection: {
      height: height * 0.6,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    heroContent: {
      alignItems: 'center',
      zIndex: 1,
    },
    heroTitle: {
      fontSize: fontSize.xxxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    heroSubtitle: {
      fontSize: fontSize.lg,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      lineHeight: fontSize.lg * 1.4,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    scrollContent: {
      paddingVertical: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    sectionSubtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    featuresGrid: {
      paddingHorizontal: spacing.lg,
      gap: spacing.lg,
    },
    featureCard: {
      marginBottom: spacing.lg,
    },
    featureIcon: {
      fontSize: fontSize.xxxl,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    featureTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    featureDescription: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: fontSize.sm * 1.4,
    },
    professionalsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
    professionalCard: {
      width: (width - spacing.lg * 2 - spacing.md) / 2,
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    professionalIcon: {
      fontSize: fontSize.xxxl,
      marginBottom: spacing.sm,
    },
    professionalName: {
      fontSize: fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    ctaSection: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      alignItems: 'center',
    },
    ctaTitle: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    ctaDescription: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      lineHeight: fontSize.md * 1.4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
          }}
          style={styles.heroSection}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Conectando talentos do audiovisual
            </Text>
            <Text style={styles.heroSubtitle}>
              A plataforma que conecta contratantes e profissionais do
              audiovisual de forma rápida, segura e prática.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Começar agora"
                onPress={() => navigation.navigate('Auth', {mode: 'register'})}
                size="lg"
              />
              <Button
                title="Explorar profissionais"
                onPress={() => navigation.navigate('Explore')}
                variant="outline"
                size="lg"
              />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.scrollContent}>
          {/* Features Section */}
          <Text style={styles.sectionTitle}>
            Como o <Text style={{color: colors.accent}}>Toca Aqui</Text> funciona
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Card key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </Card>
            ))}
          </View>

          {/* Professional Types Section */}
          <Text style={styles.sectionTitle}>Profissionais para seu evento</Text>
          <Text style={styles.sectionSubtitle}>
            Encontre os melhores profissionais do audiovisual para tornar seu
            evento inesquecível.
          </Text>
          <View style={styles.professionalsGrid}>
            {professionalTypes.map((type, index) => (
              <Card key={index} style={styles.professionalCard}>
                <Text style={styles.professionalIcon}>{type.icon}</Text>
                <Text style={styles.professionalName}>{type.name}</Text>
              </Card>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Pronto para começar?</Text>
            <Text style={styles.ctaDescription}>
              Junte-se a milhares de profissionais e contratantes no Toca Aqui.
              Cadastre-se gratuitamente e comece agora mesmo!
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Criar minha conta"
                onPress={() => navigation.navigate('Auth', {mode: 'register'})}
                size="lg"
              />
              <Button
                title="Já tenho uma conta"
                onPress={() => navigation.navigate('Auth', {mode: 'login'})}
                variant="outline"
                size="lg"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexScreen;